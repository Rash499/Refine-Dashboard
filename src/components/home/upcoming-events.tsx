import { CalendarOutlined } from '@ant-design/icons'
import { Badge, Card, List } from 'antd'
import { Text } from '../text'
import React, { useState } from 'react'
import UpcomingEventsSkeleton from '../skeleton/upcoming-events'
import { useList } from '@refinedev/core'
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries'
import dayjs from 'dayjs'

const UpcomingEvents = () => {

    const { data, isLoading} = useList({
        resource: 'events',
        pagination: { pageSize: 5},
        sorters: [
            {
                field: 'startDate',
                order: 'asc'
            }
        ],
        filters: [
            {
                field: 'startDate',
                operator: 'gte',
                value: dayjs().format('YYYY-MM-DD')
            }
        ],
        meta: {
            gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY
        }
    });
    
const getDate = (startDate: string, endDate: string) => {
    const start = dayjs(startDate).format('MMM D, YYYY h:mm A');
    const end = dayjs(endDate).format('MMM D, YYYY h:mm A');
    return `${start} - ${end}`;
    };

  return (
    <Card
        style={{
            height: '100%'
        }}
        headStyle={{
            padding: '8px 16px'
        }}
        bodyStyle={{
            padding: '0 1rem'
        }}
        title={
            <div 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <CalendarOutlined />
                    <Text size='sm' style={{ marginLeft: "0.7rem" }}>
                        Upcoming Events
                    </Text>
            </div>
        }>
        {isLoading ? (
            <List
                itemLayout='horizontal'
                dataSource={Array.from({ length: 5}).map((_, index) => ({
                    id: index,
                }))} 
                renderItem={() => <UpcomingEventsSkeleton />} />
        ) : (
            <List
                itemLayout='horizontal'
                dataSource={data?.data || []}
                renderItem={(item) => {
                   const renderDate = getDate(item.startDate, item.endDate)

                return (
                    <List.Item>
                        <List.Item.Meta 
                            avatar={<Badge color={item.color} />}
                            title={<Text size='xs'></Text>}
                            description={<Text ellipsis={{ tooltip: true }} strong>
                                    {item.title}
                            </Text>}
                        />
                    </List.Item>
                )
                }}
                />
        )}
         {!isLoading && data?.data.length === 0 && (
                    <span
                        style={
                            {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '220px'
                            }
                        }>
                        No upcoming Events
                    </span>
                )}
    </Card>
  )
}

export default UpcomingEvents