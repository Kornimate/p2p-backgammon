import AppTheme from '../shared-theme/AppTheme';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { GetPlayerGames, GetPlayerName, GetPlayerWins } from '../shared-resources/StorageHandler';
import { useState } from 'react';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '450px',
    },
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
      boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
  }));

  const Container = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
      backgroundRepeat: 'no-repeat',
      ...theme.applyStyles('dark', {
        backgroundImage:
          'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
      }),
    },
  }));


const StatsPage = (props) => {

    const [player] = useState(GetPlayerName());
    const [stats] = useState({
        games: GetPlayerGames(),
        wins: GetPlayerWins()
    })

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Container direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card variant="outlined">
                    <h2>Statistics for {player}</h2>
                    <div>Games: {stats.games}</div>
                    <div>Wins: {stats.wins}</div>
                    <Link to="/game">
                        <Button variant="outlined" sx={{width:"100%"}}>Home</Button>
                    </Link>
                </Card>
            </Container>
        </AppTheme>
    )
}

export default StatsPage;