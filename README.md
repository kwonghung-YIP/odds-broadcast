## nextjs npm libraries
- immer
- user-immer[] (for use-immer hook)
- classname
- moment

## socket.io server npm libraries
- concurrent[] (for running both tsc and nodejs watch mode)
- dotenv[] (for environment config)
- pino[] (for logging, recommand by nextjs)
- random[] (generate random number)
- socket.io (socket.io server)
- @socket.io/redis-adapter (socket.io redis adapter - for broadcasting while running on multi-nodes environment)
- redis (for redis pub/sub client)

## socket.io server - npm libraries (development dependencies)
- typescript
- tslib
- @types/node (type script for nodes)
- eslint
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser

## Development VM tools
- git curl
- On My Zsh, powerfont
- docker
- nodejs
- microk8s
- skaffold
- kubectl
- k9s

### Run skaffold dev mode
```bash
skaffold dev --profile microk8s
```
### Docker run commands
```bash
docker run \
  --name redis --rm -it \
  -p 6379:6379 \
  redis:7.2
```

```bash
docker exec -it redis redis-cli
```

```bash
docker run \
  --name redis-stack --rm -it \
  -p 6379:6379 -p 8001:8001 \
  -e REDIS_ARGS="--requirepass mypassword" \
  redis/redis-stack:7.2.0-v6
```

```bash
docker exec -it redis-stack redis-cli
```
