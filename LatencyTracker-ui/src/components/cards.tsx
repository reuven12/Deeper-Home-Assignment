import React, { useState } from 'react';
import { MonitoringStatus, Website } from '../models/website.interfaces';
import '../assets/css/cards.css';
import { Button } from 'primereact/button';
import ActionsCard from './actionsCard';

interface WebsitesProps {
  cards: Website[];
}

const GridCards: React.FC<WebsitesProps> = ({ cards }) => {
  const [showCreateCardForm, setShowCreateCardForm] = useState<boolean>(false);
  const [showActionsCard, setShowActionsCard] = useState<Website | null>(null);
  const getColorForStatus = (status: MonitoringStatus) => {
    switch (status) {
      case MonitoringStatus.GOOD:
        return 'green';
      case MonitoringStatus.AVERAGE:
        return 'yellow';
      case MonitoringStatus.POOR:
        return 'red';
      default:
        return 'grey';
    }
  };

  return (
    <div className="grid-items">
      <div className="grid-container">
        {cards.map((item, index) => (
          <div
            key={index}
            className="grid-item"
            onClick={() => setShowActionsCard(item)}
          >
            <p>{item.name}</p>
            <div 
              className="status-indicator"
              style={{
                backgroundColor: getColorForStatus(item.monitoringStatus!),
              }}
            ></div>
          </div>
        ))}
        <div className="grid-item">
          <Button
            icon="pi pi-plus"
            className="plus-icon-button"
            onClick={() => setShowCreateCardForm(true)}
          ></Button>
        </div>
        {showCreateCardForm && (
          <ActionsCard
            onClose={() => setShowCreateCardForm(false)}
            createCard={true}
          />
        )}
        {showActionsCard && (
          <ActionsCard
            onClose={() => setShowActionsCard(null)}
            createCard={false}
            website={showActionsCard}
          />
        )}
      </div>
    </div>
  );
};

export default GridCards;
