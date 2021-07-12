This folder contains all transcript data.  

This folder is inherently insecure in the same way the as the database. 

While the RESTful API will only send responses from correctly logged in
users, users with access to the servers filesystem can read all files in
this folder.

This folder needs the same local security precautions as the database.