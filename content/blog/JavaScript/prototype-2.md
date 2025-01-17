---
title: "[JavaScript] 프로토타입"
date: 2021-03-29 22:03:98
category: javascript
---

![](images/javascript.png)

> 자바스크립트의 모든 Object는 프로토타입이라는 속성을 가지고 있다.

<br />

# 1. getPrototypeOf : 프로토타입 접근

```js
const person = {
  name: 'jessie',
};

const prototype = Object.getPrototypeOf(person);

console.log(typeof prototype); // object
console.log(person.__proto__ === prototype); // true
```

- `getPrototypeOf` 라는 함수로 프로토타입을 가져올 수 있다.
- 프로토타입은 `null` 또는 `object` 타입이다.
- 많은 자바스크립트 엔진에서는 `__proto__` 라는 이름으로 프로토타입 속성에 접근할 수 있다.
- 자바스크립트 표준에서는 브라우저에서만 `__proto__` 를 지원하는 것으로 나와있지만 사실 거의 모든 자바스크립트 엔진에서 지원하고 있다.
- 프로토타입에 접근하는 안전하고 공식적인 방식은 `getPrototypeOf` 함수를 이용하는 것이다.

<br />

# 2. setPrototypeOf : 프로토타입 변경

```js
const person = {
  name: 'jessie',
};
const programmer = {
  language: 'js',
};

Object.setPrototypeOf(programmer, person); // programmer.__proto__ = person 과 동일

console.log(Object.getPrototypeOf(programmer) === person); // true
console.log(programmer.name); // mike
```

- `programmer`의 프로토타입은 `person`이 된다.
- 프로토타입은 속성값을 읽을 때 사용된다. `programmer`에는 `name`이라는 속성이 없다. 이렇게 자기 자신에 없는 속성에 접근할 때 프로토타입에서 그 속성을 찾는다.
`programmer`의 프로토타입은 `person`이기 때문에 `person`에서 `name`을 찾는다.

<br />

# 3. 프로토타입 체인 : 여러 단계로 연결할 수 있는 프로토타입

```js
const person = {
  name: 'jessie',
};
const programmer = {
  language: 'js',
};
const frontend = {
  framework: 'react',
};

Object.setPrototypeOf(programmer, person);
Object.setPrototypeOf(frontend, programmer);

console.log(frontend.name, frontend.language); // jessie, js
console.log(frontend.__proto__.__proto__.name, frontend.__proto__.language); // jessie, js
```

- `frontend`의 프로토타입은 `programmer`이고 `programmer`의 프로토타입은 `person`이 된다.
- 체인을 따라가면서 속성값을 찾아낸다.

<br />

# 4. 새로운 속성 추가하기

```js
const person = {
  name: 'jessie',
};
const programmer = {
  language: 'js',
};

Object.setPrototypeOf(programmer, person);
programmer.name = 'lia';

console.log(programmer.name); // lia
console.log(person.name); // jessie
```

- 새로운 속성을 추가할 때는 프로토타입 체인을 이용하는 것이 아니고 자기 자신의 속성을 추가한다.

<br />

# 5. 프로토타입을 이용한 공통 함수

```js
const person = {
  name: 'jessie',
  say() {
    console.log('hello');
  },
};
const programmer = {
  language: 'js',
}

Object.setPrototypeOf(programmer, person);
programmer.say(); // hello
```

- 프로토타입은 일반적인 객체이기 때문에 함수를 정의해서 공통 로직을 추가할 수 있다.
- `programmer`에는 `say` 함수가 없지만 호출할 수 있다.

<br />

# 6. for-in 문법 사용하기

```js
const person = {
  name: 'jessie',
};
const programmer = {
  language: 'js',
};

Object.setPrototypeOf(programmer, person);

for (const prop in programmer) {
  console.log(prop); // language name
}

for (const prop in programmer) {
  if (programmer.hasOwnProperty(prop)) {
    console.log(prop); // language
  }
}

for (const prop of Object.keys(programmer)) {
  console.log(prop); // language
}
```

- for-in 문법을 사용하면 프로토타입에 있는 속성까지 사용이 된다.
- 만약 for-in 문법을 사용할 때 자기 자신의 속성만 사용하고 싶다면 `hasOwnProperty` 메서드나 `Object.keys`를 사용하면 된다.

<br>

# 7. 생성자 함수와 this

```js
function Person(name) {
  // this = {};
  this.name = name;
  // return this;
}

const p1 = new Person('jessie');
console.log(p1.name); // jessie
```

- `new` 키워드를 사용해서 객체를 만들 때 사용하는 함수를 **생성자 함수**라고 부른다.
- `new` 키워드를 사용해서 함수를 실행하면 자바스크립트 엔진은 내부적으로 `this`에 빈 객체를 할당해준다. 그리고 함수가 종료되기 전에 `this`를 반환해준다.
- `p1`은 `Person` 함수에서 반환된 `this`이다.

<br>

# 8. 프로토타입 객체에 메서드 정의해서 메모리 효율적으로 사용하기

```js
function Person(name) {
  this.name = name;
  this._salary = 0;
}

Person.prototype = {
  setSalary(salary) {
    this._salary = Math.max(0, Math.min(1000, salary));
  },
  getSalary() {
    return this._salary;
  },
}

const p1 = new Person('jessie');

p1.setSalary(2000);
console.log(p1.getSalary); // 2000

const p2 = new Person('lia');
console.log(p1.getSalary === p2.getSalary); // true
```

- 생성자 함수 내에서 메서드를 정의하면, 해당 생성자 함수를 이용해서 객체를 만들 때마다 메서드가 생성된다. → 메모리 측면에서 비효율적이다.
- 프로토타입 객체를 이용해서 함수를 정의하면 메서드를 한 번만 만들어서 재사용하게 된다.
- 위의 코드에서는 `p1`과 `p2`의 `getSalary`, `setSalary` 메서드가 동일하다.

<br>

# 9. constructor

```js
function Person(name) {
  this.name = name;
}

console.log(Person.prototype.constructor === Person); // true
```

- 함수의 프로토타입 객체에는 `constructor`라는 속성이 있다.
- `constructor`는 해당 함수를 가리킨다.

<br>

### Reference
- [https://www.inflearn.com/course/실전-자바스크립트](https://www.inflearn.com/course/%EC%8B%A4%EC%A0%84-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8)