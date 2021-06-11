---
id: usage-with-class-components
title: Usage with class components
---

If you want to use the `useSession()` hook in your class components you can do so with the help of a higher order component or with a render prop.

## Higher Order Component

```js
import { useSession } from "next-auth/react"

const withSession = Component => props => {
  const [session, loading] = useSession()

    // if the component has a render property, we are good
    if (Component.prototype.render) { 
      return <Component session={session} loading={loading} {...props} />
    }

    // if the passed component is a function component, there is no need for this wrapper
    throw new Error([
     "You passed a function component, `withSession` is not needed.",
     "You can `useSession` directly in your component."
    ].join("\n"))
};

// Usage
class ClassComponent extends React.Component {
  render() {
    const {session, loading} = this.props
    return null
  }
}

const ClassComponentWithSession = withSession(ClassComponent)
```

## Render Prop

```js
import { useSession } from "next-auth/react"

const UseSession = ({ children }) => {
  const [session, loading] = useSession()
  return children({ session, loading })
};

// Usage
class ClassComponent extends React.Component {
  render() {
    return (
      <UseSession>
        {({ session, loading }) => (
          <pre>{JSON.stringify(session, null, 2)}</pre>
        )}
      </UseSession>
    )
  }
}
```