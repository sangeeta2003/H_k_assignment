// Using Exclude to create a new type without 'scroll'
type event = 'click' | 'scroll' | 'mousemove';
type ExcludeEvent = Exclude<Event, 'scroll'>; // 'click' | 'mousemove'

// Function that accepts only 'click' and 'mousemove' events
const handleEvent = (event: ExcludeEvent) => {
  console.log(`Handling event: ${event}`);
};

handleEvent('click'); // OK
// handleEvent('scroll'); // Error: Argument of type '"scroll"' is not assignable to parameter of type 'ExcludeEvent'.