import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from 'primereact/inputnumber';
import { Website, WebsiteActionTypes } from '../models/website.interfaces';
import '../assets/css/cards.css';
import {
  handleCardUpdated,
  handleCardDeleted,
  handleCardCreated,
} from '../utils/cardsUtils';

interface ActionsCardProps {
  onClose: () => void;
  createCard: boolean;
  website?: Website;
}

const ActionsCard: React.FC<ActionsCardProps> = ({
  onClose,
  createCard,
  website,
}) => {
  const [updateWebsite, setUpdateWebsite] = useState<Partial<Website> | null>(
    website || null,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUpdateWebsite((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMonitoringTimeChange = (e: InputNumberValueChangeEvent) => {
    const { value } = e;
    setUpdateWebsite((prevState) => ({
      ...prevState,
      testFrequency: value as number,
    }));
  };

  const handleActions = (actions: WebsiteActionTypes) => {
    switch (actions) {
      case WebsiteActionTypes.CREATE:
        if (updateWebsite) {
          handleCardCreated(updateWebsite as Website);
        }
        break;
      case WebsiteActionTypes.UPDATE:
        if (updateWebsite) {
          handleCardUpdated(updateWebsite);
        }
        break;
      case WebsiteActionTypes.DELETE:
        if (website) {
          handleCardDeleted(website.id as number);
        }
        break;
      default:
        break;
    }
    onClose();
  };

  const headers: (keyof Website)[] = ['name', 'url', 'testFrequency'];
  return (
    <Dialog
      className="card-dialog"
      header={<div className="dialog-header">Website Details</div>}
      visible
      onHide={onClose}
    >
      <div className="p-field">
        {headers.map((header) => (
          <div key={header}>
            <label
              className="header-input"
              htmlFor={header}
            >{`${header[0].toUpperCase()}${header.slice(1)}:`}</label>
            {header !== 'testFrequency' ? (
              <InputText
                className="field-value"
                name={header}
                value={updateWebsite?.[header] as string}
                onChange={handleInputChange}
              />
            ) : (
              <InputNumber
                className="field-value"
                name={header}
                value={updateWebsite?.[header] as number}
                onValueChange={handleMonitoringTimeChange}
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-dialog-footer">
        <Button
          className="p-button-cancel"
          label="Cancel"
          icon="pi pi-times"
          onClick={onClose}
        />
        <Button
          className="p-button-update"
          label={createCard ? 'Create' : 'Update'}
          icon="pi pi-check"
          onClick={() =>
            handleActions(
              createCard
                ? WebsiteActionTypes.CREATE
                : WebsiteActionTypes.UPDATE,
            )
          }
        />
        {!createCard && (
          <Button
            className="p-button-delete"
            icon="pi pi-trash"
            onClick={() => handleActions(WebsiteActionTypes.DELETE)}
          />
        )}
      </div>
    </Dialog>
  );
};

export default ActionsCard;
