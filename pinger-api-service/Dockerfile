FROM mcr.microsoft.com/dotnet/sdk:6.0
WORKDIR /app
RUN dotnet tool install  --global dotnet-ef
COPY . .
RUN dotnet restore
EXPOSE 5122