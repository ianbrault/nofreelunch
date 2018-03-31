import gevent
gevent.monkey.patch_all()
import pymongo as pym
import ssl
import select

global_ssl = ssl.SSLContext()

# 
class Server:
    def __init__(self, port_num):
        full_address = "localhost:" + str(port_num)
        super().__init__(listener=full_address, handle=self.handle_conn, ssl_context=global_ssl)
        # client is the MongoDB client used to interact with the database
        self.mongo_client = pym.MongoClient()
        # user_db is the actual database used to store user data
        self.user_db = self.mongo_client.user_db
        # users is the MongoDB collection that stores all the users
        self.users = self.user_db.users
        # A user must consist of the following fields:
        #   - Full name (name) - string with no @
        #   - Username (username) - unique among all users - string with no @
        #   - Email (email) - string with @
        #   - Current debts owed to others (liabilities) - A dictionary from payids to (user, amount) 2-tuples, where 
        #       type(payid) = unique ints, type(user) = username string, and type(amount) = float with precision 2
        #   - Current debts owed by others to user (outstanding_reqs) - A dictionary from payids to (user, amount) 2-tuples, where 
        #       type(payid) = unique ints, type(user) = username string, and type(amount) = float with precision 2
        #   - Friends (friends) - list of username strings
        #   - Current NFL balance (balance) - float with precision 2

        # This creates a select.poll object, which can be easily used to poll the available connections
        # for available data. If the connections have data to be read, the data (which will be requests
        # of the form in the SERVER_README) will be read and requests will be served correctly.
        self.poller = select.poll()
        # Because poller only returns a file descriptor instead of a socket object, we need to maintain
        # a mapping between file descriptor numbers and socket objects in order to access the sockets
        self.socket_dict = {}

    def handle_conn(self, socket, address):
        print('New connection from %s:%s' % address)
        socket_fileno = socket.fileno()
        self.socket_dict[socket_fileno] = socket
        self.poller.register(socket_fileno)

    def poll_clients(self):
        task_list = self.poller.poll(1)
        for task in task_list:
            if task[1] == select.POLLIN:
                socket_fileno = task[0]
                corresp_socket = self.socket_dict[socket_fileno]
                gevent.Greenlet.spawn(self.handle_data, socket=corresp_socket)
        gevent.Greenlet.spawn(self.poll_clients)


    def handle_data(socket):
        request = str(socket.recv(bufsize=4096))
        split_req = request.split()
        req_type = split_req[0].upper()
        if req_type == "CREATE":
            full_name = split_req[3] + " " + split_req[4]
            gevent.Greenlet.spawn(self.create_user, user=split_req[1], email=split_req[2], 
                                  full_name=split_req[4], account_token=split_req[5])
        elif req_type == "SEARCH":
            flag = None
            if len(split_req) == 4 and (split_req[3].upper() == "FRIEND" or split_req[3].upper() == "SHORT"):
                flag = split_req[3]
            gevent.Greenlet.spawn(self.search_user, searcher=split_req[1], searchee=split_req[2], 
                                  flag=flag)
        elif req_type == "UPDATE":
            gevent.Greenlet.spawn(self.update_user, user=split_req[1], fields=split_req[1:])
        elif req_type == "ADDFRIEND":
            gevent.Greenlet.spawn(self.add_friend, searcher=split_req[1], new_friend=split_req[2])
        elif req_type == "CHARGE":
            gevent.Greenlet.spawn(self.charge_users, charger=split_req[1], chargees_amts=split_req[2:])
        elif req_type == "COMPLETE":
            gevent.Greenlet.spawn(self.complete_charge, payer=split_req[1], payee=split_req[2], amount=float(split_req[3]), method=split_req[4])
        elif req_type == "TRANSFER":
            gevent.Greenlet.spawn(self.transfer_out, user=split_req[1], amount=float(split_req[2]))

    def create_user(self, user, email, full_name, account_token):

    def search_user(self, searcher, searchee, flag):

    def update_user(self, user, fields):

    def charge_users(self, charger, chargees_amts):

    def complete_charge(self, payer, payee, payid): 


