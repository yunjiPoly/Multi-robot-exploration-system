default: run

run: dockerfile
	docker stop inf3995-client || true
	docker run --name inf3995-client \
	--net=host \
	--rm -it inf3995-equipe103-client npm run starthost

test: dockerfile
	npm run test

dockerfile: Dockerfile
	docker build -t inf3995-equipe103-client .

.PHONY: default run dockerfile