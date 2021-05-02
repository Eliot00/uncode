import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Board, { moveCard } from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import { useEffect, useState } from 'react';
import UncodeBridge from '../../../uncode-bridge';

export interface Card {
  id: number;
  title: string;
  description: string;
}

export function StoryPage() {
  UncodeBridge.title('Uncode - Story');
  let [board, setBoard] = useState({
    columns: [{ id: 1, title: 'Backlog', cards: [] }],
  } as any);

  useEffect(() => {
    UncodeBridge.getStory().then(stories => {
      let column_map: any = {
        backlog: { id: 1, title: 'Backlog', cards: [] },
        doing: { id: 2, title: 'Doing', cards: [] },
        done: { id: 3, title: 'Done', cards: [] },
      };
      let card_map: any = {};
      for (let story of stories) {
        if (!card_map[story.status]) {
          card_map[story.status] = 1;
        } else {
          card_map[story.status]++;
        }

        column_map[story.status].cards.push({
          id: card_map[story.status],
          title: story.title,
          description: story.description,
        });
      }

      let new_board = { columns: [] };
      for (let key in column_map) {
        // @ts-ignore
        new_board.columns.push(column_map[key]);
      }

      setBoard(new_board);
    });
  }, []);

  function onCardNew(newCard) {
    const card = { id: '', ...newCard };
    UncodeBridge.createStory(card);
    return card;
  }

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(board, source, destination);
    setBoard(updatedBoard);
  }

  return (
    <>
      <Helmet>
        <title>Uncode Story</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Board
          allowAddCard={{ on: 'top' }}
          onNewCardConfirm={onCardNew}
          onCardNew={console.log}
          disableColumnDrag
          onCardDragEnd={handleCardMove}
        >
          {board}
        </Board>
      </PageWrapper>
    </>
  );
}

export const A = styled.a`
  color: ${p => p.theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;
