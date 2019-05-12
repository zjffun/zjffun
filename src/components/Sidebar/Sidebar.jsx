// Import External Dependencies
import React from 'react';

// Import Local Components
import Shield from '../Shield/Shield';
import SidebarItem from '../SidebarItem/SidebarItem';

// Load Styling
import '../Sidebar/Sidebar.scss';

// Create and export the component
export default ({
  className = '',
  pages,
  currentPage,
  section,
  page,
  ...props
}) => {
  return (
    <nav className={`sidebar ${className}`}>
      <div className="sidebar__inner">
        {/* Breadcrumb */}
        <p className="sidebar__bc"><a href={section.url}>{section.name}</a> / <span>{page.name}</span></p>
        {page.anchors.map((anchor, index) => {
          return (
            <React.Fragment key={`sidebar-item-${index}`}>
              <SidebarItem
                id={anchor.id}
                title={anchor.title}
                level={anchor.level}
                currentPage={currentPage}
              />
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
