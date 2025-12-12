'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// ----------------------------------------------------------------------

const StyledEditor = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  transition: theme.transitions.create(['border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.08)}`,
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
  '& .ql-container': {
    minHeight: 300,
    fontSize: '1rem',
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.background.paper,
    '& .ql-editor': {
      minHeight: 300,
      padding: theme.spacing(3),
      lineHeight: 1.8,
      fontSize: '1rem',
      color: theme.palette.text.primary,
      '& p': {
        marginBottom: theme.spacing(1.5),
      },
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        fontWeight: 700,
      },
      '& h1': { fontSize: '2rem' },
      '& h2': { fontSize: '1.75rem' },
      '& h3': { fontSize: '1.5rem' },
      '& h4': { fontSize: '1.25rem' },
      '& ul, & ol': {
        paddingLeft: theme.spacing(3),
        marginBottom: theme.spacing(1.5),
      },
      '& blockquote': {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        paddingLeft: theme.spacing(2),
        marginLeft: 0,
        marginRight: 0,
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      },
      '&.ql-blank::before': {
        fontStyle: 'normal',
        color: theme.palette.text.disabled,
        left: theme.spacing(3),
      },
    },
  },
  '& .ql-toolbar': {
    borderTopLeftRadius: theme.shape.borderRadius * 1.5,
    borderTopRightRadius: theme.shape.borderRadius * 1.5,
    borderColor: alpha(theme.palette.divider, 0.8),
    backgroundColor: alpha(theme.palette.background.neutral, 0.8),
    backdropFilter: 'blur(8px)',
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    '& .ql-formats': {
      marginRight: theme.spacing(1),
      '&:not(:last-child)::after': {
        content: '""',
        display: 'inline-block',
        width: '1px',
        height: '24px',
        backgroundColor: theme.palette.divider,
        marginLeft: theme.spacing(1),
        verticalAlign: 'middle',
      },
    },
    '& .ql-picker': {
      color: theme.palette.text.primary,
      '& .ql-picker-label': {
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.shape.borderRadius,
        transition: theme.transitions.create(['background-color', 'color'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
        },
        '&.ql-active': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.main,
        },
      },
      '& .ql-picker-options': {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.customShadows?.z8 || theme.shadows[8],
        padding: theme.spacing(0.5),
        '& .ql-picker-item': {
          padding: theme.spacing(0.75, 1.5),
          borderRadius: theme.shape.borderRadius * 0.5,
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
          },
          '&.ql-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
        },
      },
    },
    '& button': {
      padding: theme.spacing(0.75, 1),
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create(['background-color', 'color'], {
        duration: theme.transitions.duration.shorter,
      }),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        color: theme.palette.primary.main,
        '& .ql-stroke': {
          stroke: theme.palette.primary.main,
        },
        '& .ql-fill': {
          fill: theme.palette.primary.main,
        },
      },
      '&.ql-active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        '& .ql-stroke': {
          stroke: theme.palette.primary.main,
        },
        '& .ql-fill': {
          fill: theme.palette.primary.main,
        },
      },
      '& .ql-stroke': {
        stroke: theme.palette.text.secondary,
        transition: theme.transitions.create('stroke', {
          duration: theme.transitions.duration.shorter,
        }),
      },
      '& .ql-fill': {
        fill: theme.palette.text.secondary,
        transition: theme.transitions.create('fill', {
          duration: theme.transitions.duration.shorter,
        }),
      },
    },
  },
  '& .ql-container.ql-snow': {
    borderBottomLeftRadius: theme.shape.borderRadius * 1.5,
    borderBottomRightRadius: theme.shape.borderRadius * 1.5,
    borderColor: 'transparent',
  },
  '& .ql-snow.ql-toolbar button:hover, & .ql-snow .ql-toolbar button:hover, & .ql-snow.ql-toolbar button:focus, & .ql-snow .ql-toolbar button:focus, & .ql-snow.ql-toolbar button.ql-active, & .ql-snow .ql-toolbar button.ql-active, & .ql-snow.ql-toolbar .ql-picker-label:hover, & .ql-snow .ql-toolbar .ql-picker-label:hover, & .ql-snow.ql-toolbar .ql-picker-label.ql-active, & .ql-snow .ql-toolbar .ql-picker-label.ql-active, & .ql-snow.ql-toolbar .ql-picker-item:hover, & .ql-snow .ql-toolbar .ql-picker-item:hover, & .ql-snow.ql-toolbar .ql-picker-item.ql-selected, & .ql-snow .ql-toolbar .ql-picker-item.ql-selected':
    {
      color: theme.palette.primary.main,
    },
}));

// ----------------------------------------------------------------------

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  minHeight?: number;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Текст оруулна уу...',
  error = false,
  helperText,
  minHeight = 300,
}: Props) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          // Custom handlers can be added here
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'direction',
    'link',
    'image',
    'video',
    'align',
    'color',
    'background',
  ];

  return (
    <Box>
      <StyledEditor
        sx={{
          '& .ql-container .ql-editor': {
            minHeight,
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.3),
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.5),
              },
            },
          },
          ...(error && {
            borderColor: 'error.main',
            boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.error.main, 0.12)}`,
            '&:hover': {
              borderColor: 'error.main',
            },
            '&:focus-within': {
              borderColor: 'error.main',
              boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.error.main, 0.2)}`,
            },
          }),
        }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            fontFamily: 'inherit',
          }}
        />
      </StyledEditor>
      {helperText && (
        <Box
          sx={{
            mt: 1,
            px: 1.5,
            fontSize: '0.75rem',
            color: error ? 'error.main' : 'text.secondary',
          }}
        >
          {helperText}
        </Box>
      )}
    </Box>
  );
}
