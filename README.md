# SoilFLO Backend Trial

This project serves to demonstrate my (Andrew J. MacKenzie) abilities, as a coder, to take on the specs of a small project and fulfill them accurately and to completion. [Click here](https://github.com/SoilFLO/interview-takehome-be) to go to the original spec-sheet (repo) on GitHub.

Particular points of interest will most likely be the services `TicketCreationService` and `TicketFetchingService` as well as the controller `TicketController`.

## Setting up

At the Project's Root run `npm i` to install our dependencies.

Next, run `cp .env.example .env` to get yourself started filling out the required env-vars.

### Database Setup

This project connects to a Postgres database. If you do not have one set up, you can get one going quickly using Docker. Feel free to find an image to run, or use the script below to get yourself going.

```
docker run --env=POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15-alpine
```

#### PG-Admin

Recommended, though not necessary -- PG-Admin provides a User-Interface that makes Database-Management much easier (in my opinion).

```
docker run --user=pgadmin --env=PGADMIN_DEFAULT_PASSWORD=1234 --env=PGADMIN_DEFAULT_EMAIL=youremail@email.com -p 80:80 --restart=no -d dpage/pgadmin4:7
```

#### Schema

You can navigate to the Schema scripts in this readme and execute them on your database, or simply use the env-var `DB__SYNCHRONIZE=true` to get going quickly.

> Please do not use `DB__SYNCHRONIZE=true` in a Production environment.

#### Data Seeding

If Data-Seeding is required, my strategy was to grab the data from the [SoilFLO Repository](https://github.com/SoilFLO/interview-takehome-be), convert it to CSV, and import the data through PG-Admin.

#### Schema Scripts

This application requires a Database to run with 3 tables defined: `sites` `trucks` and `tickets`.

Below you may find examples of these tables written for a Postgres database.

##### Sites

```sql
create table if not exists sites (
	id int not null generated by default as identity,
	name varchar(32) not null,
	address varchar(512) not null,
	description varchar(1024) not null,
  primary key (id)
)
```

##### Trucks

```sql
create table if not exists trucks (
	id int not null generated by default as identity,
	license varchar(32) not null unique,
	"siteId" integer not null,
	primary key (id),
	constraint fk_site
		foreign key ("siteId")
		references sites(id)
)
```

##### Tickets

```sql
create table if not exists tickets (
	id int not null generated by default as identity,
	"truckId" int not null,
	"siteId" int not null,
	material varchar(32) not null,
	"dispatchedAt" timestamptz not null,
	"siteCounter" int default 0 not null,
	primary key (id),
	constraint fk_truck
		foreign key ("truckId")
		references trucks(id),
	constraint fk_site
		foreign key ("siteId")
		references sites(id)
)
```

## Questions For Clarity

As this is for an interview, I am of the understanding that we do not get the opportunity to ask questions for the sake of clarity. Therefore, I will pose my questions here, along with my assumption, to demonstrate where opportunities for correction may have been able to take place.

### Ticket Site-Counter

##### Observation/Question

> A ticket has a number that is incremented per site

First, a *Ticket* does not have a *Site* when dispatched.

Next is the question of *when* should the increment occur ... which may also then ask the question of the meaing or purpose of this counter.

##### Assumption

The *Site* is pulled from the *Ticket's Truck*. That is easy to assume.

The description of this counter also seems to indicate that a *Site* may have many *Trucks* -- whether or not this truth is represented in the JSON data or not -- the schema allows for this and this requirement suggests this to be the case as well.

I will assume, for now, that this ticket counter is simply a way for a human-readable distinct identifier for sites and trucks to use to indicate into their respective systems when tickets/pieces-of-work are completed and that both the ticket-counter as well as the site's name will be used to accomplish this. Therefore, the dispatch time does not need to be taken into account when incrementing this value. ( I had wondered if maybe the increments should occur in orderance of the dispatch timestamps of the tickets of the site ... but I shall *not* go ahead with this idea )

### Ticket Material is Soil

##### Observation/Question

For this application, a *Ticket's Material* will always be *Soil* ... but why call it "Material" insteaad of just "Soil"? -- are there other Material Types?

##### Assumption

The wording makes it seem that perhaps we should be preparing for other types of Materials in the future -- maybe different types of soil.

Let's make sure we have a `Material` column in our `Tickets` table and while initially we will provide it a value of `Soil`, we will use enums our application that can be easily extended/added-to to allow future types of Materials. 

(It would be better to make a `Materials` table and FK-Ref it in the `Tickets` table -- but, keeping it simple, let's just use an enum for now)

### Should a *Ticket* have a *Site*?

##### Question/Observation

In the description of a *Ticket* there is no reference to one having a *Site* -- only a *Truck*.

However, just thinking things through -- a *Truck* could, in the future, be assigned to a different *Site*. It is likely that, once the work of a *Site* is complete, that a *Truck* is assigned to a new *Site*. 

... and a *Ticket* represents work completed. If someone wanted to ask about work done on a particualr *Site*, and that *Site* had been completed and the *Truck* had therefore been assigned to a new *Site*, there would be no way to get those *Tickets* unless the *Ticket* had a reference to the *Site*.

##### Assumption

We should include `siteId` to our `Tickets` table. We are not duplicating data, we need this information for the scenario described above.

### Endpoints for Trucks & Sites?

##### Question/Observation

> On top of the existing trucks and sites, we need to be able to create a ticket for a truck that describes a load of material being dispatched off site.

I'm not sure if I should be interpereting this as a requirement to create endpoints for Trucks & Sites.

##### Assumption

I assume no, as there are no specs for creating Trucks and Sites; however, it *would* be easy to extract that from the Entities themselves.

## To-Do

### How does Sequelizer relations work?

I've worked with Sequelizer directly; however, for the sake of consistency and conformity with Nest-JS, I want to use and declare Entity Relationships correctly using their techniques and best-practices.

Temporarily, I will use the foreign-keys as primitive values/columns.

In the future, try to figure out how to declare these Relationships and access them the Nest-JS/Sequelize way!

### Pagination for our Controllers

We definitely would want this for `Sites` -- but can definitely see a need for this for `Trucks` and `Tickets` too!

### Threshold for Ticket's Dispatched-At timestamp

One of the requirements of a Ticket is that Tickets belonging to a Truck cannot share the same Dispatch timestamp. I wonder if perhaps a Threshold should be put in place that could be used to determine the minimum amount of time-difference between Tickets -- Tickets that are just milliseconds apart should likely not be allowed as they are, in a more "real-world" sense, the same time. We would likely want something that is meaningful, while also ensuring this rule would not get in the way for an exceptional situation (ask subject-matter-experts for input).

### Database Transactions

We should be wrapping collections of work into Transactions. When creating Tickets in bulk, it will be weird if some get created while others do not due to error. Look into Sequelize Transactions and see if there is a "Nest-JS" way of wrapping Transactions around our work. May be tricky working through Async functions -- might be fun!

### Serialization concerns ...

I'm curious to know how others have worked through this. Maybe this is just a personal preference, but I find Nest-JS's solution to the Data-Contract is to couple the Data-Contract to the Entity in the same class.

While this would be outside of the scope for this project, it would be interesting to find (or create) a solution for Serializing our Entities and/or Business-Objects that does _not_ involve us working serialization within those classes.


### Thoughts on Restful endpoints and this project

My endpoints do not represent much for Rest. I am quite capable of this; however, there are only 2 endpoints for this project ... and one of them creates tickets in bulk, which I would typically use a functional endpoint for.

The only change I could see is if we wanted to move that endpoint to a Truck.

```
// current endpoint
POST /create-truck-tickets

// proposed endpoint
POST /trucks/{id}/create-tickets
```

I would still opt for a function-name for the endpoint as `POST .../tickets` would typically only store a single resource, not many.

My reason for _not_ doing this is because I did not want to have 2 Controllers with 1 endpoint in each for *essentially* the same resource. In a more complex (or full) application, this may be beneficial; however, in this case ... I think I already complicated this project enough 😅.
