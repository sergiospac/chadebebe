import React, { useState } from 'react';
import styled from 'styled-components';
import PageLayout from '../../components/layout/PageLayout';
import TipoItemList from './tipoItem/TipoItemList';
import EventoList from './evento/EventoList';
import EnxovalList from './enxoval/EnxovalList';

enum AdminTab {
  TIPOS_ITEM = 'tipos_item',
  EVENTOS = 'eventos',
  ENXOVAIS = 'enxovais'
}

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.active ? 'var(--medium-blue)' : 'var(--light-gray)'};
  color: ${props => props.active ? 'white' : 'var(--dark-gray)'};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.active ? 'var(--dark-blue)' : 'var(--medium-gray)'};
  }
`;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.TIPOS_ITEM);

  const renderTabContent = () => {
    switch (activeTab) {
      case AdminTab.TIPOS_ITEM:
        return <TipoItemList />;
      case AdminTab.EVENTOS:
        return <EventoList />;
      case AdminTab.ENXOVAIS:
        return <EnxovalList />;
      default:
        return null;
    }
  };

  return (
    <PageLayout title="Painel Administrativo">
      <TabContainer>
        <Tab 
          active={activeTab === AdminTab.TIPOS_ITEM}
          onClick={() => setActiveTab(AdminTab.TIPOS_ITEM)}
        >
          Tipos de Item
        </Tab>
        <Tab 
          active={activeTab === AdminTab.EVENTOS}
          onClick={() => setActiveTab(AdminTab.EVENTOS)}
        >
          Eventos
        </Tab>
        <Tab 
          active={activeTab === AdminTab.ENXOVAIS}
          onClick={() => setActiveTab(AdminTab.ENXOVAIS)}
        >
          Enxovais
        </Tab>
      </TabContainer>
      {renderTabContent()}
    </PageLayout>
  );
};

export default AdminDashboard; 