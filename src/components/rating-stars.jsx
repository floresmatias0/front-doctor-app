import React from 'react';
import { Box } from "@chakra-ui/react";

export const renderStars = (rating, booking, size = '15px') => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (rating >= i + 1) {
            stars.push(
                <Box
                    key={i}
                    as="span"
                    color="#ffbd13"
                    borderColor="#c6c2b8"
                    sx={{
                        display: 'inline-block',
                        fontSize: size,
                        lineHeight: '1',
                        marginRight: '4px',
                        marginTop: '2px',
                        marginBottom: '1px',
                        '::before': {
                            content: `"★"`,
                            color: "#ffbd13",
                            WebkitTextStrokeWidth: '1px',
                            WebkitTextStrokeColor: '#ffbd13'
                        }
                    }}
                />
            );
        } else if (rating >= i + 0.5) {
            stars.push(
                <Box
                    key={i}
                    as="span"
                    position="relative"
                    sx={{
                        display: 'inline-block',
                        fontSize: size,
                        lineHeight: '1',
                        marginRight: '4px',
                        marginTop: '2px',
                        marginBottom: '1px',
                        '::before': {
                            content: `"★"`,
                            color: "#ffffff",
                            WebkitTextStrokeWidth: '1px',
                            WebkitTextStrokeColor: '#c6c2b8'
                        }
                    }}
                >
                    <Box
                        as="span"
                        color="#ffbd13"
                        sx={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            overflow: 'hidden',
                            width: '50%',
                            '::before': {
                                content: `"★"`,
                                color: "#ffbd13",
                                WebkitTextStrokeWidth: '1px',
                                WebkitTextStrokeColor: '#ffbd13'
                            }
                        }}
                    />
                </Box>
            );
        } else {
            stars.push(
                <Box
                    key={i}
                    as="span"
                    color="#c6c2b8"
                    borderColor="#c6c2b8"
                    sx={{
                        display: 'inline-block',
                        fontSize: size,
                        lineHeight: '1',
                        marginRight: '4px',
                        marginTop: '2px',
                        marginBottom: '1px',
                        '::before': {
                            content: `"★"`,
                            color: "#ffffff",
                            WebkitTextStrokeWidth: '1px',
                            WebkitTextStrokeColor: '#c6c2b8'
                        }
                    }}
                />
            );
        }
    }
    return stars;
};
