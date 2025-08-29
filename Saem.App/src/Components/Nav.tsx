// MiMutual.WebApp/src/components/Nav.tsx
type ActiveView = 'anexo1' | 'anexo2';

interface NavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function Nav({ activeView, setActiveView }: NavProps) {
  
  // 2. Usamos `preventDefault` para evitar que el enlace recargue la página
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, view: ActiveView) => {
    event.preventDefault();
    setActiveView(view);
  };
  return (
    <nav className="main-nav">
      <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#" 
            // 3. La clase 'active' se aplica dinámicamente
            className={activeView === 'anexo1' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'anexo1')}>Anexo I</a></li>
        <li><a href="#" 
            className={activeView === 'anexo2' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'anexo2')}>Anexo II</a></li>
        <li><a href="#">Anexo III</a></li>
        <li><a href="#">Anexo IV</a></li>
        <li><a href="#">Anexo V</a></li>
        <li><a href="#">Anexo VII</a></li>
      </ul>
    </nav>
  );
}