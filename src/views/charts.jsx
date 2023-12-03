import { Center, Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { instance } from "../utils/axios";
import Chart from "chart.js/auto";

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


const Graphs = () => {
    const chartRef = useRef(null);
    const pieChartRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let barChartInstance, pieChartInstance;
    
        const fetchDataCountReserveByDay = async () => {
            try {
                setLoading(true)
                const { data } = await instance.get('/calendars/charts-booking');
                setLoading(false)
                return data.data;
            } catch (err) {
                console.log(err.message);
                setLoading(false)
                return []; // Devuelve un array vacío en caso de error
            }
        };
    
        const createCharts = async () => {
            const countsReserveByDay = await fetchDataCountReserveByDay();
    
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

            const ctxBar = chartRef.current.getContext("2d");
            barChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: countsReserveByDay.bookingDays,
                    datasets: [{
                        label: `Total reservas por dia (${new Date().toLocaleString('default', { month: 'long' })})`,
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 2,
                        fill: false,
                        data: countsReserveByDay.countsByDay,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
    
            const ctxPie = pieChartRef.current.getContext("2d");
            pieChartInstance = new Chart(ctxPie, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        type: 'bar',
                        label: `Total consultas`,
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 2,
                        fill: false,
                        data: totalReservationsData,
                    },
                    {
                        type: 'bar',
                        label: 'Total recaudado',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        fill: false,
                        data: totalPriceData,
                    }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        };
    
        createCharts();
    
        // Clean up function
        return () => {
            if (barChartInstance) {
                barChartInstance.destroy();
            }
            if (pieChartInstance) {
                pieChartInstance.destroy();
            }
        };
    }, []);

    return (
        <Flex w={["280px", "100%"]} h="100%" flexDirection="column">
            <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Gráficos</Text>

            {loading ? (
                <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                    <Center>
                        <Spinner color="#205583" />
                    </Center>
                </Flex>
            ) : (
                <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[0, 2, 4]} py={4} flexDirection="row" flexWrap="wrap" overflow="auto">
                    <Flex w="100%" justifyContent="center" alignItems="center">
                        <Box w={["100%", "100%", "100%", "50%"]} minWidth="600px" minHeight="450px" overflow="auto">
                            <canvas ref={chartRef}></canvas>
                        </Box>
                    </Flex>
                    <Flex w="100%" justifyContent="center" alignItems="center">
                        <Box w={["100%", "100%", "100%", "50%"]} minWidth="600px" minHeight="450px" overflow="auto">
                            <canvas ref={pieChartRef}></canvas>
                        </Box>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}

export default Graphs;
