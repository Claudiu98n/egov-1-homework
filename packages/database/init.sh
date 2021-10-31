echo "-------------------------------------------------"
echo "   🔧 E-Gov-Homework-1 Local Database  "
echo "-------------------------------------------------"
echo ""
echo ""


echo "📦 Create volume if it does not exist"
sudo mkdir -p /var/egov-1/postgres-volume-egov

echo "🐳 Running Docker image as PostgresDB"
docker run --name egov-1-homework -p 5432:5432 -e POSTGRES_DB=strapi -e POSTGRES_USER=strapi -e POSTGRES_PASSWORD=strapi -v /var/egov-1/postgres-volume-egov:/var/lib/postgresql/data -d postgres:9.6
