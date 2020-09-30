This is a Java script to read data from a .yml file and populate the OpenERM Database with that data. 

-The Script-
When started the Script will delete all data currently in the patient_data table to make sure that its a fresh start, and will repopulate it with the data that's currently in the YAML file OR from Sythea depending on the choice you make. If you wanna keep any data currently in that table, then don't run this script.

-YAML FILE-
The value for each field can easily be changes to customize or add more patients as needed. If you need to add more patients then simply make another copy of patient data and change the fields needed before running the script. Make sure that "id" and "pid" fields are unquie otherwise the INSERT will fail.

-SYNTHEA-
Retrieves mock patient data from synthea by calling 'https://syntheticmass.mitre.org/v1/fhir/Patient' and retrieving a number of patients decided when running the script

-DATABASE-
Currently the scprit is programmed to connect to a database at:
url = "jdbc:mysql://localhost:3306/";
user = "openemr";
password = "openemr";

To change these values the code in com.HDI.main.PopulateDB must be editted.


Note:
-If using docker to set up the database then you must make sure that the ports are exposed. In compose yml file add:
=====
    ports:
    - 3306:3306
    expose:
    - 3306 
=====