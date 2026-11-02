import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  params: {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', to);
      setPath(to);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute route parameters if any (e.g. /app/items/ITEM-1001 or /desk/matches/MATCH-101)
  const params: Record<string, string> = {};
  if (path.startsWith('/app/items/') && path !== '/app/items') {
    params.id = path.replace('/app/items/', '');
  } else if (path.startsWith('/desk/matches/') && path !== '/desk/matches') {
    params.id = path.replace('/desk/matches/', '');
  } else if (path.startsWith('/desk/handovers/') && path !== '/desk/handovers') {
    params.id = path.replace('/desk/handovers/', '');
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
}> = ({ href, className, children, onClick, 'aria-label': ariaLabel }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('#')) return; // anchor hash links scroll naturally
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
};
