import React from 'react'

interface Route {
  id: string
  name: string
  icon: string
  component: string
}

interface BottomNavigationProps {
  routes: Route[]
  currentRoute: string
  onRouteChange: (routeId: string) => void
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  routes,
  currentRoute,
  onRouteChange
}) => {
  return (
    <nav className="bottom-navigation">
      {routes.map((route) => (
        <button
          key={route.id}
          className={`nav-item ${currentRoute === route.id ? 'active' : ''}`}
          onClick={() => onRouteChange(route.id)}
        >
          <div className="nav-icon">{route.icon}</div>
          <div className="nav-label">{route.name}</div>
        </button>
      ))}
    </nav>
  )
}