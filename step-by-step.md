Create app

```
nest new personal-finances-app
```

Install dependecies

```
npm i pg @nestjs/typeorm typeorm class-validator class-transformer @nestjs/swagger swagger-ui-express bcrypt @nestjs/passport passport passport-local @nestjs/jwt passport-jwt @nestjs/config joi --save

npm i @types/pg @types/bcrypt @types/passport-local @types/passport-jwt --save-dev
```

Create modules

```
nest g mo database
nest g mo auth
nest g mo users
nest g mo items
```

Create controllers

```
nest g co auth/controllers/auth --flat --no-spec
nest g co users/controllers/users --flat --no-spec
nest g co items/controllers/items --flat --no-spec
nest g co items/controllers/categories --flat --no-spec
```

Create services

```
nest g s auth/services/auth --flat --no-spec
nest g s users/services/users --flat --no-spec
nest g s items/services/items --flat --no-spec
nest g s items/services/categories --flat --no-spec
```

Create DTOs

```
/src/users/dtos/user.dto.ts
/src/items/dtos/item.dto.ts
/src/items/dtos/category.dto.ts
```

Create Entities

```
/src/users/entities/user.entity.ts
/src/items/entities/item.entity.ts
/src/items/entities/category.entity.ts
```

Create DataSource

```
/src/database/data-source.ts
```
