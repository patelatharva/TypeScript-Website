// Conditionals Types provide a way to do simple logic in the
// TypeScript type system. This is definitely an advanced
// feature, and it's quite feasible that you won't need to
// use this in your normal day to day code.

// A conditional type looks like:
//
//   A extends B ? C : D
//
// Where the conditional is whether a type extends an
// expression, and if so what type should be returned. A
// type could also be deferred for

// Let's go through some simple examples

type Cat = { meows: true };
type Dog = { barks: true };
type Cheetah = { meow: true; fast: true };
type Wolf = { barks: true; howls: true };

// We can create a conditional type which lets use extract
// types which only conform to something which barks.

type ExtractDogish<A> = A extends { barks: true } ? A : never;

// Then we can create types which ExtractDogish wraps:

// A cat doesn't bark, so it will return never
type NeverCat = ExtractDogish<Cat>;
// A wolf will bark, so it returns the wolf shape
type Wolfish = ExtractDogish<Wolf>;

// This becomes useful when you want to work with a
// union of many types and reduce the number of potential
// options in a union:

type Animals = Cat | Dog | Cheetah | Wolf;

// When you apply ExtractDogish to a union type, it is the
// same as running the conditional against each member of
// the type:

type Dogish = ExtractDogish<Animals>;

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>

// = never | Dog | never | Wolf

// = Dog | Wolf (see example:unknown-and-never)

// This is call a distributive conditional type because the
// type distributes over each member of the union.

// Deferred Conditional Types

// Conditional types can be used to tighten your APIs which
// can return different types depending on the inputs. 

// For example this function which could return either a
// string or number depending on the boolean passed in.

declare function getAdoptionID<T extends boolean>(user: {}, oldSystem: T): T extends true ? string : number;

// Then depending on how much the type-system knows about
// the boolean, you will get different return types:

let stringReturnValue = getAdoptionID({}, /* oldSystem */ true);
let numberReturnValue = getAdoptionID({}, /* oldSystem */ false);
let stringOrID = getAdoptionID({}, /* oldSystem */ Math.random() < 0.5);

// In this case above TypeScript can know the return value
// instantly. However, you can use conditional types in functions
// where the type isn't known yet. This is called a deferred
// conditional type.

// Same as our Dogish above, but as a function instead
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// There is an extra useful tool within conditional types, which
// is being able to specifically tell TypeScript that it should
// infer the type when deferring. That is the 'infer' keyword.

// infer is typically used to create meta-types which inspect
// the existing types in your code, think of it as creating 
// a new variable inside the type

type GetReturnValue<Type> = Type extends (...args: any[]) => infer Return ? Return : Type

// Roughly:
//
//  - this is a conditional generic type called GetReturnValue 
//    which takes a type in it's first parameter
//
//  - the conditional checks if the type is a function, and 
//    if so create a new type called Return based on the return
//    value for that function
//
//  - If the pass checks, the type value is the inferred
//    return value, otherwise it is the original Type
//

type getAdoptionIDReturn = GetReturnValue<typeof getAdoptionID>

// This fails the check for being a function, and would 
// just return the type passed into it.
type getCat = GetReturnValue<Cat>
