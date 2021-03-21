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
