import React from 'react';
import { Box } from "@chakra-ui/react";

export const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (rating >= i + 1) {
            stars.push(
                <Box
                    key={i}
                    as="span"
                    color="#ffbd13" // Color de relleno
                    borderColor="#c6c2b8" // Color del borde
                    sx={{
                        display: 'inline-block',
                        fontSize: '15px', // Ajusta el tamaño de las estrellas
                        lineHeight: '1',
                        marginRight: '4px',
                        marginTop: '2px',
                        marginBottom: '1px',
                        '::before': {
                            content: `"★"`,
                            color: "#ffbd13", // Relleno
                            WebkitTextStrokeWidth: '1px',
                            WebkitTextStrokeColor: '#ffbd13' // Borde
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
                        fontSize: '15px', // Ajusta el tamaño de las estrellas
                        lineHeight: '1',
                        marginRight: '4px',
                        marginTop: '2px',
                        marginBottom: '1px',
                        '::before': {
                            content: `"★"`,
                            color: "#ffffff", // Relleno vacío
                            WebkitTextStrokeWidth: '1px',
                            WebkitTextStrokeColor: '#c6c2b8' // Borde
                        }
                    }}
                >
                    <Box
                        as="span"
                        color="#ffbd13" // Color de relleno
                        sx={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            overflow: 'hidden',
                            width: '50%',
                            '::before': {
                                content: `"★"`,
                                color: "#ffbd13", // Relleno
                                WebkitTextStrokeWidth: '1px',
                                WebkitTextStrokeColor: '#ffbd13' // Borde
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
                    color="#c6c2b8" // Color de relleno vacío
                    borderColor="#c6c2b8" // Color del borde
                    sx={{
                        display: 'inline-block',
                        fontSize: '15px', // Ajusta el tamaño de las estrellas
                        lineHeight: '1',
                        marginRight: '4px',
                        marginTop: '2px',
                        marginBottom: '1px',
                        '::before': {
                            content: `"★"`,
                            color: "#ffffff", // Relleno vacío
                            WebkitTextStrokeWidth: '1px',
                            WebkitTextStrokeColor: '#c6c2b8' // Borde
                        }
                    }}
                />
            );
        }
    }
    return stars;
};
