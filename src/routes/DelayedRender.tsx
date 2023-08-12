import { useState, useEffect, ReactNode } from 'react';

interface DelayedRenderProps {
  condition: boolean;
  children: ReactNode;
}

const DelayedRender: React.FC<DelayedRenderProps> = ({
  condition,
  children,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeout);
  }, []);

  return condition || showContent ? children : null;
};

export default DelayedRender;
