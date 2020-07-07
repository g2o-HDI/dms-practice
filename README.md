# dms-practice
Diabetes Management Solution practice project

## DMS Installation Prerequisites
- [Installing Docker](https://docs.docker.com/get-docker/)

## Running Docker Authorization server on local machine
Execute docker command `docker run -p 8083:8083 mgharib/keycloack-auth-server` to run Authorization server on port 8083. Once it is up, you should be able to access it via [http://localhost:8083/auth/](http://localhost:8083/auth/)

## configuring OpenEMR with HAPI FHIR on local machine
-	Clone current repo 
-	Navigate with CMD into openemr-compose
-	Execute docker-compose -f openemr-compose.yml up -d
-	When all containers are started, you can access to:
	-	The FHIR server [http://localhost:8080/home](http://localhost:8080/home)
	-	The OpenEMR server: [http://localhost:80/](http://localhost:80/) 
-	configure OpenEMR to be able to export to the FHIR server [https://medium.com/@ben.che/openemr-fhir-how-to-setup-your-instance-dd646b0daec3](https://medium.com/@ben.che/openemr-fhir-how-to-setup-your-instance-dd646b0daec3)
		-	Login info for OpenEMR
			-	Username: admin
			-	Password: pass
			

## Running Spring Authorization server on local machine
-	Clone current repo
-	Open with prefered Java IDE
-	use the following commands inside the terminal
	-	mvn clean
	-	mvn install
	-	mvn spring-boot:run
-	Once running, visit http://localhost:8083/auth/
	-	login: emr-admin
	-	password: pass
