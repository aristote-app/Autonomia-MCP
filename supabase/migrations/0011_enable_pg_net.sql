-- Mirror the pg_net extension state detected in the Autonomia project.
-- pg_net provides asynchronous outbound HTTP and keeps its request API in schema net.
create extension if not exists pg_net;
