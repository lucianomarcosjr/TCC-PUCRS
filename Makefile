.PHONY: help up down logs restart clean seed

help:
	@echo "Comandos disponíveis:"
	@echo "  make up       - Iniciar todos os containers"
	@echo "  make down     - Parar todos os containers"
	@echo "  make logs     - Ver logs dos containers"
	@echo "  make restart  - Reiniciar containers"
	@echo "  make clean    - Remover volumes e containers"
	@echo "  make seed     - Popular banco com dados iniciais"

up:
	docker-compose up -d
	@echo "✅ Containers iniciados!"
	@echo "Backend: http://localhost:3333"
	@echo "PostgreSQL: localhost:5432"
	@echo "MongoDB: localhost:27017"

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v
	@echo "✅ Volumes removidos!"

seed:
	docker exec -i omniflow-postgres psql -U omniflow -d omniflow < database/seeds/01_initial_data.sql
	@echo "✅ Dados iniciais inseridos!"
