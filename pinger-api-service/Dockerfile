FROM mcr.microsoft.com/dotnet/sdk:6.0
WORKDIR /app
RUN dotnet tool install  --global dotnet-ef
COPY . .
CMD ["dotnet", "watch", "run"]
EXPOSE 5122