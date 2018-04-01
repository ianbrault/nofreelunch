import gevent
gevent.monkey.patch_all()
import pymongo as pym
import ssl
import select
import stripe
import json
with open("stripe_api.key", 'r') as f:
    stripe.api_key = f.readline()
global_ssl = ssl.SSLContext()

CHARGE_ID_FILE = "curr_charge_id.txt"
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
        #   - Password (epassword) - frontend-encrypted password, stored for validating logins
        #   - Current debts owed to others (liabilities) - A dictionary from payids to (user, amount) 2-tuples, where 
        #       type(payid) = unique ints, type(user) = username string, and type(amount) = float with precision 2,
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
        with open(CHARGE_ID_FILE, 'r') as f:
            self.curr_charge_id = int(readline(f))


    @staticmethod
    def log_io(socket, msg):
        socket.send(msg.encode())
        print(msg)


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
        split_req = request.split(maxsplit=1)
        req_type = split_req[0].upper()
        try:
            req_json = json.loads(split_req[1])
        except json.JSONDecodeError:
            self.log_io(socket, "INVALID REQUEST - request body not JSON!")
        if req_type == "CREATE":
            full_name = split_req[1] + " " + split_req[2]
            gevent.Greenlet.spawn(self.create_user, req_json, socket)
        elif req_type == "GETUSER":
            gevent.Greenlet.spawn(self.get_user, req_json, socket)
        elif req_type == "UPDATE":
            gevent.Greenlet.spawn(self.update_user, req_json, socket)
        elif req_type == "ADDFRIEND":
            gevent.Greenlet.spawn(self.add_friend, req_json, socket)
        elif req_type == "CHARGE":
            gevent.Greenlet.spawn(self.charge_users, req_json, socket)
        elif req_type == "COMPLETE":
            gevent.Greenlet.spawn(self.complete_charge, req_json, socket)
        elif req_type == "TRANSFER":
            gevent.Greenlet.spawn(self.transfer_out, req_json, socket)
        else:
            self.log_io(socket, "INVALID REQUEST - request type not recognized!")


    def create_user(self, req_json, socket):
        # A user must consist of the following fields:
        #   - Full name (name) - string with no @ - input from frontend
        #   - Username (username) - unique among all users - string with no @ - input from frontend
        #   - Email (email) - string with @ - input from frontend
        #   - Transfer Out ID (transfer_id) - Stripe account ID associated with the users Connect Custom account, which
        #     can be used to transfer money out of the account - created server-side
        #   - Payment ID (pay_id) - Stripe account ID associated with the users Customer account, used to charge the
        #     user's bank account
        #   - Current NFL balance (balance) - float with precision 2
        #   - Current debts owed to others (liabilities) - A dictionary from payids to (user, amount) 2-tuples, where 
        #     type(payid) = unique ints, type(user) = username string, and type(amount) = float with precision 2
        #   - Current debts owed by others to user (outstanding_reqs) - A dictionary from payids to (user, amount) 
        #     2-tuples, where type(payid) = unique ints, type(user) = username string, and type(amount) = float with 
        #     precision 2
        #   - Friends (friends) - list of username strings

        # Code to create the users Connect Custom account, which can be
        # used to transfer money out of the app
        try:
            username = req_json["username"]
            email = req_json["email"]
            legal_entity = req_json["legal_entity"]
            payment1 = req_json["payment_source_token1"]
            payment2 = req_json["payment_source_token2"]
            epassword = req_json["epass"]
        except KeyError:
            self.log_io(socket, "ERROR - JSON format invalid - missing some fields!")
            return

        # Validate uniqueness of emails and usernames in account creation
        if self.users.find_one({"_id" : username}) is not None:
            self.log_io(socket, "FAILURE - An account with that username already exists!")
        if self.users.find_one({"email" : email}) is not None:
            self.log_io(socket, "FAILURE - An account with that email already exists!")

        for key in ["address", "dob", "first_name", "last_name", "ssn_last_4"]:
            if key not in legal_entity:
                self.log_io(socket, "ERROR - No " + key + " in legal entity JSON!")
                return

        account_dict = {}
        account_dict["legal_entity"] = legal_entity
        account_dict["legal_entity"]["address"]["country"] = "US"
        account_dict["tos_shown_and_accepted"] = True
        account_token = stripe.Token.create(account=account_dict)
        new_account = stripe.Account.create(
          country="US",
          type="custom",
          account_token=account_token,
        )
        new_account.external_account = payment1
        new_account.save()

        # Code to create the users Customer object, which can be used to
        # charge the user money i.e. so they can pay out of their bank
        new_cust = stripe.Customer.create(source=payment2)

        full_name = legal_entity["first_name"] + " " + legal_entity["last_name"]

        new_user = {"_id" : username,
                    "name" : full_name,
                    "email" : email,
                    "epass" : epassword,
                    "transfer_id" : new_account.id,
                    "pay_id" : new_account.id,
                    "balance" : 0,
                    "liabilities" : {},
                    "outstanding_reqs" : {},
                    "friends" : [],
                    }
        self.users.insert_one(new_user)
        self.log_io("SUCCESS - User " + username + " created")


    def get_user(self, req_json, socket):
        for key in ["user_id", "flag"]:
            if key not in req_json:
                self.log_io(socket, "ERROR - Missing " + key +  " in request JSON")
        user = None
        if "@" in req_json["user_id"]:
            user = self.users.find_one({"email" : req_json["user_id"]})
        else:
            user = self.users.find_one({"_id" : req_json["user_id"]})
        if user is None:
            self.log_io("FAILURE")
            return
        elif req_json["flag"].upper() == "VERB":
            abriged_user = user
            del abridged_user["transfer_id"]
            del abridged_user["pay_id"]
        elif req_json["flag"].upper() == "SHORT":
            abridged_user = user["epass"]
        self.log_io("SUCCESS\n" + json.dumps(abridged_user))


    def update_user(self, req_json, socket):
        changes = req_json["deltas"]
        ident = None
        ident_val = None
        update_dict = {}
        # Check which identification method to update by
        if "username" in changes:
            if "email" in changes:
                self.log_io("FAILURE - Cannot change email and username at same time!")
                return
            if self.users.find_one({"_id" : req_json["username"]}) is not None:
                self.log_io("FAILURE - Account already exists with that username!")
                return
            update_dict["_id"] = req_json["username"]
            # These set how we find the user to update
            ident = "email"
            ident_val = req_json["email"]
        else:
            ident = "_id"
            ident_val = req_json["username"]

        # Check whether or not to update each of the variables besides username
        if "email" in changes:
            if self.users.find_one({"email" : req_json["email"]}) is not None:
                self.log_io("FAILURE - Account already exists with that email!")
                return
            update_dict["email"] = req_json["email"]

        if ("payment1" in changes) != ("payment2" in changes):
            self.log_io("FAILURE - must update both payment values or none!")

        connect_account = None
        curr_user = None
        if "payment1" in changes or "name" in changes:
            # Update the transfer out account
            curr_user = self.users.find_one({ident : ident_val})
            connect_account = stripe.Account.retrieve(curr_user.transfer_id)

        if "payment1" in changes:
            connect_account.external_account = req_json["payment1"]
            connect_account.save()
            # Update the pay out account
            customer_account = stripe.Customer.retrieve(curr_user.pay_id)
            customer_account.source = req_json["payment2"]
            customer_account.save()

        if "name" in changes:
            first_name = req_json["name"].split()[:-1]
            last_name = req_json["name"].split()[-1]
            connect_account.legal_entity.first_name = first_name
            connect_account.legal_entity.last_name = last_name
            connect_account.save()
            update_dict["name"] = req_json["name"]

        self.users.update_one(
            {ident : ident_val}
            {$set : update_dict})
        self.log_io("SUCCESS")


    def add_friend(self, req_json, socket):

    def charge_users(self, req_json, socket):

    def complete_charge(self, req_json, socket):

    def transfer_out(self, req_json, socket):


