schemaVersion: 1.2

endpoints:
  - name: backend-api
    displayName: Backend API
    service:
      basePath: /
      port: 5173
    type: REST
    networkVisibilities:
      - Public