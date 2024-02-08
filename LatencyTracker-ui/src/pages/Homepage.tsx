import React, { useEffect, useState } from 'react';
import { WebsitesService } from '../services/websites.service';
import '../assets/css/cards.css';
import GridCards from '../components/cards';
import { Website } from '../models/website.interfaces';
import { io, Socket } from 'socket.io-client';

const Homepage: React.FC = () => {
  const [cards, setCards] = useState<Website[]>([]);
  useEffect(() => {
    const socket: Socket = io('http://localhost:8001');
    socket.on('websiteCreated', websiteCreated);
    socket.on('websiteUpdated', websiteUpdated);
    socket.on('websiteDeleted', websiteDeleted);
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchCurds = async () => {
      const usersData: Website[] = await WebsitesService.getCurds();
      setCards(usersData);
    };

    fetchCurds();
  }, []);

  const websiteCreated = (newWebsite: Website) => {  
    setCards((prevState) => [...prevState, newWebsite]);
  };

  const websiteUpdated = (updatedWebsite: Website) => {    
    setCards((prevState) => {
      return prevState.map((website) =>
        website.id === updatedWebsite.id
          ? { ...website, ...updatedWebsite }
          : website,
      );
    });
  };

  const websiteDeleted = (deletedWebsiteId: number) => {
    setCards((prevState) => {
      return prevState.filter(
        (website) => website.id !== Number(deletedWebsiteId),
      );
    });
  };

  return (
    <div className="main-layout">
      <GridCards cards={cards} />
    </div>
  );
};

export default Homepage;
