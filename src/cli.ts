#!/usr/bin/env node
import { createAPIServer } from "./main"

const PORT = process.env.PORT || 3000
const EXTERNAL_APIS = process.env.EXTERNAL_APIS || ""

const server = createAPIServer(EXTERNAL_APIS.split(",").filter(host => host !== ""))

server.listen(PORT, () => console.log(`🚀🚀🚀 - Server is listening on port ${PORT}`))