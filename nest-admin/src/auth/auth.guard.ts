import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const jwt = request.cookies.jwt;
      return this.jwtService.verify(jwt);
    } catch (error) {
      return false;
    }
  }
}

/*
- 모든 Guards는 canActivate 함수를 구현해야 함
- @UseGuards()로 사용하며 Pipe, Exception Filter와 마찬가지로 Controller, Method, Global 범위에 둘 수 있음. ( global은 app.useGlobalGuards()로 사용 )

* GlobalGuards는 의존성 주입이 될 수 없음 (모듈 컨텍스트 밖에서 수행되기 때문). 아래의 코드를 통해 모든 모듈에서 직접 가드 설정이 가능해짐
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomGuard,
    },
  ],
})
export class AppModule {}

- 현재 요청이 허용되는지 여부를 나타내는 조건값(true / false)을 반환해야 함
- 응답을 sync / async 로 반환할 수 있음 (Promise / Observable)
- canActivate 함수는 ExecutionContext 인스턴스라는 단일 인수를 가짐


* ExecutionContext는 ArgumentsHost를 확장하여 현재 실행 프로세스에 대한 추가정보를 제공함

export interface ExecutionContext extends ArgumentsHost {
  getClass<T = any>(): Type<T>; // 특정 핸들러가 속하는 Controller 클래스 유형 리턴
  getHandler(): Function; // 호출될 핸들러에 대한 참조 리턴
}

ex) CatsController에서 create() 메소드로 지정된 POST요청이 오면, getHandler()는 create() 메소드에 대한 참조를 리턴하고
    getClass()는 CatsController Type(no instance)를 반환함
*/