import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { MotionContainer } from 'src/components/animate';

import getVariant from '../get-variant';

// ----------------------------------------------------------------------

const TEXT = 'Zone';

type ContainerViewProps = {
  isText: boolean;
  isMulti: boolean;
  selectVariant: string;
};

export default function ContainerView({
  isText,
  isMulti,
  selectVariant,
  ...other
}: ContainerViewProps) {
  const items = isMulti;

  return (
    <Paper
      sx={{
        p: 3,
        minHeight: 480,
        display: 'flex',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.neutral',
      }}
      {...other}
    >
      {isText ? (
        <MotionContainer
          component={m.h1}
          sx={{ typography: 'h1', display: 'flex', overflow: 'hidden' }}
        >
          {TEXT.split('').map((letter, index) => (
            <m.span key={index} variants={getVariant(selectVariant)}>
              {letter}
            </m.span>
          ))}
        </MotionContainer>
      ) : (
        <MotionContainer>
          {[].map((_: any) => (
            <Box
              component={m.img}
              variants={getVariant(selectVariant)}
              sx={{
                my: 2,
                width: 480,
                borderRadius: 1,
                objectFit: 'cover',
                height: isMulti ? 72 : 320,
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            />
          ))}
        </MotionContainer>
      )}
    </Paper>
  );
}
