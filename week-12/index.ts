
// pick 


interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
// Creating a new type with only `name` and `email` properties from `User`
type UserProfile = Pick<User, 'name' | 'email'>;

// Function that accepts a UserProfile type
const displayUserProfile = (user: UserProfile) => {
  console.log(`Name: ${user.name}, Email: ${user.email}`);
};


