# Pipe
- @Injectable() 데코레이터와 함께 annotate됨
- Pipe는 PipeTransform 인터페이스를 구현

---
## pipe는 2가지 use case를 지님
1. transformation : input data를 원하는 형태로 변환
2. validation: input data를 평가하고 만약 유효하다면 변환없이 전달함. 그렇지 않다면 예외를 던짐

- pipe는 controller route handler의 arguments 위에서 작동함 (메소드가 호출되기 전에 위치)

## NestJS는 기본적인 6개의 pipe를 제공함
- ValidationPipe
- ParseIntPipe
- ParseBooleanPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe

### ParseIntPipe
- integer로 변환된 메서드 핸들러 파라미터를 보장 (실패시 에러)
```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```
- findOne()에서 받는 파라미터 id는 숫자이거나, 에러. 둘 중에 하나일 것임.

> GET localhost:3000/abc
```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

```ts
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```
- option을 통해서 예외 처리를 커스텀할 수도 있음.
- pipe는 Query(), Param(), Body()에서 동작함

---
## Custom Pipes
```ts
// ValidationPipe
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArugmentMetadata) {
    return value;
  }
}
```
- PipeTransform<T, R>은 제네릭 인터페이스이며 구현되어야 함.
- value를 나타내기 위한 T, R은 transform()의 메서드 리턴값을 나타냄
- 모든 pipe는 transform()을 구현해야 함
- transform()은
  - value
  - metadata
- 2가지 파라미터를 가짐

```ts
// metadata
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype ?: Type<unknown>;
  data?: string;
}
```
|metadata||
|------|---|
|type|인자가 @Body()인지, @Query()인지, @Param()인지 또는 커스텀 파라미터 인지 나타냄|
|metatype|인자의 metatype 제공. 예를 들면, route handler method에서 type선언을 빠트리거나 vanilla js를 사용한다면 그 값은 undefined|
|data|데코레이터에 전달된 문자열. 예를 들면 @Body('string'). 만약 데코레이터를 비워놨다면 undefined|
- ts 인터페이스는 트랜스파일 과정에서 사라지는데, 메서드 파라미터 타입이 클래스 대신 인터페이스라면 metatype은 Object가 됨

---
# Schema based validation
```ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```
```ts
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```
- createCatDto 객체의 3가지 속성을 검증하고 싶을 때

## Class validator
> $ npm i --save class-validator class-transformer
```ts
// create-cat.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

```ts
// validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```
- nestjs는 sync, async 모두 지원하며, class-validator의 validation들 중 async가 있기 때문에 transform은 async로 선언
- toValidate()는 현재 처리 중인 argument가 native js 타입이라면 유효성 검사를 생략함.
- plainToClass()는 typed object를 plain js argument object로 변환하기 위해 사용함
  - 네트워크 요청에서 역직렬화시, post body object는 type information이 없음
- class-validator는 dto를 정의한 validation decorator를 사용해야 하므로 들어오는 body를 vanila object가 아닌 적절한 decorated object로 취급하기 위해 변환할 필요가 있음

```ts
// cats.controller.ts
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
```
---
# Global scoped pipes
```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

## Dependency injection 측면에서의 global pipe 선언
```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```
---
## Transform
```ts
// parse-int.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```
- parseIntPipe는 validation이 아닌, transform 역할을 해줌

- 