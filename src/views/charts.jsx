import { Center, Flex, Spinner, Text, Box, Heading, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { instance } from "../utils/axios";
import Chart from "chart.js/auto";
import Upgrade from "../components/upgrade";
import SymptomsSettings from "../components/symptoms-settings";

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Graphs = () => {
    const chartRef = useRef(null);
    const pieChartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [countsReserveByDay, setCountsReserveByDay] = useState({
        bookingDays: [],
        countsByDay: [],
        bookingStats: []
    });

    useEffect(() => {
        const fetchDataCountReserveByDay = async () => {
            try {
                const { data } = await instance.get('/calendars/charts-booking');
                setCountsReserveByDay(data.data);
            } catch (err) {
                console.log(err?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDataCountReserveByDay();
    }, []);

    useEffect(() => {
        if (!loading && chartRef.current && pieChartRef.current) {
            const ctxBar = chartRef.current.getContext("2d");
            const ctxPie = pieChartRef.current.getContext("2d");

            if (ctxBar && ctxPie) {
                const allMonthsData = Array.from({ length: 12 }, (_, index) => {
                    const month = index + 1;
                    return countsReserveByDay.bookingStats.find(stats => stats._id.month === month) || {
                        _id: { month },
                        totalReservations: 0,
                        totalPrice: 0
                    };
                });

                const totalReservationsData = allMonthsData.map(stats => stats.totalReservations);
                const totalPriceData = allMonthsData.map(stats => stats.totalPrice);

                new Chart(ctxBar, {
                    type: 'bar',
                    data: {
                        labels: countsReserveByDay.bookingDays,
                        datasets: [{
                            label: `Total reservas por día (${new Date().toLocaleString('default', { month: 'long' })})`,
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 2,
                            fontFamily:"Roboto",
                            fill: false,
                            data: countsReserveByDay.countsByDay,
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                min: 0,
                                max: Math.max(1, Math.max(...countsReserveByDay.countsByDay)),
                            },
                        },
                    },
                });

                new Chart(ctxPie, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            type: 'bar',
                            label: `Total consultas`,
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 2,
                            fontFamily:"Roboto",
                            fill: false,
                            data: totalReservationsData,
                        },
                        {
                            type: 'bar',
                            label: 'Total recaudado',
                            borderColor: 'rgb(255, 99, 132)',
                            fontFamily:"Roboto",
                            borderWidth: 2,
                            fill: false,
                            data: totalPriceData,
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                min: 0,
                                max: Math.max(1, Math.max(...totalReservationsData), Math.max(...totalPriceData)),
                            },
                        },
                    },
                });
            }
        }
    }, [loading, countsReserveByDay]);

    return (
        <Flex
            w={["full", "calc(100% - 155px)"]}
            h="100%"
            justifyContent={["center", "top"]}
            alignItems="center"
            flexDirection="column"
            mx={[5, 0]}
        >
            <Box maxW={["full", "1240px", "full"]} w="100%" h="100%">
                <Flex
                    flexDirection={["column", "row"]}
                    justifyContent="space-between"
                    alignItems={["start", "center"]}
                    flex={1}
                >
                    <Heading
                        fontSize={["15px", "25px"]}
                        fontWeight={700}
                        lineHeight={["17.58px", "29.3px"]}
                        color="#104DBA"
                        border={["1px solid #104DBA", "none"]}
                        px={[4, 0]}
                        py={[0.5, 0]}
                        rounded={["xl", "none"]}
                    >
                        Administración
                    </Heading>
                </Flex>
                {loading ? (
                    <Flex w="100%" h="100%" px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Center>
                            <Spinner color="#205583" />
                        </Center>
                    </Flex>
                ) : (
                    <Flex
                        w="100%"
                        h="100%"
                        gap={4}
                        flexDirection="column"
                        px={[0, 2, 4]}
                        py={4}
                        overflow="auto"
                    >
                        <Tabs
                            isFitted
                            variant="enclosed"
                            flex={1}
                            display="flex"
                            flexDirection="column"
                        >
                            <TabList>
                                <Tab fontFamily="Roboto">Graficos</Tab>
                                <Tab fontFamily="Roboto">Usuarios</Tab>
                                <Tab fontFamily="Roboto">Sintomas</Tab>
                            </TabList>

                            <TabPanels
                                flex={1}
                                display="flex"
                                flexDirection="column"
                            >
                                <TabPanel flex={1} p={0} py={2}>
                                    <Flex w="100%" h="100%" flexDirection="column">
                                        <Flex w="100%" h="50%" minWidth={["100%", "600px"]} overflow="auto" justifyContent="center" alignItems="center">
                                            <canvas style={{width: '100%', height: '100%'}} ref={chartRef}></canvas>
                                        </Flex>
                                        <Flex w="100%" h="50%" minWidth={["100%", "600px"]} overflow="auto" justifyContent="center" alignItems="center">
                                            <canvas style={{width: '100%', height: '100%'}} ref={pieChartRef}></canvas>
                                        </Flex>
                                    </Flex>
                                </TabPanel>
                                <TabPanel p={0} flex={1} py={2}>
                                    <Upgrade />
                                </TabPanel>
                                <TabPanel p={0} flex={1} py={2}>
                                    <SymptomsSettings />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default Graphs;
