'use client'
import React, { useCallback, useState } from 'react';
import { Accordion, AccordionSummary, Avatar, Typography, AccordionDetails, Grid2, Skeleton } from '@mui/material';
import { ArrowDropDown, PeopleAlt, FiberManualRecord, Restaurant, Star, Code, Visibility } from '@mui/icons-material'
import { TUser, TDetailRepos, TDetailUser } from '@/types'
import { useGetDetailUser, useGetDetailRepos } from '@/hooks'


type TProps = {
    item: TUser & { detailUser: TDetailUser | null, detailRepos: Array<TDetailRepos> }
    index: number
    setValue: React.Dispatch<React.SetStateAction<Array<TUser & { detailUser: TDetailUser | null, detailRepos: Array<TDetailRepos> }>>>
    listUser: Array<TUser & { detailUser: TDetailUser | null, detailRepos: Array<TDetailRepos> }>
}

export default function Index(props: TProps) {
    /** Props */
    const { item, index, setValue, listUser } = props

    /** States */
    const [isExpanded, setIsExpanded] = useState(false);

    /** Mutations */
    const { mutateAsync: mutationRepos, isPending: pendingRepos } = useGetDetailRepos()
    const { mutateAsync: mutationUser, isPending: pendingUser } = useGetDetailUser()

    /** Functions */
    const onHandleDetail = useCallback(async () => {
        await mutationUser(item.login, {
            onSuccess(data) {
                const temp = listUser
                temp[index].detailUser = data
                setValue(temp);
            }
        })

        await mutationRepos(item.login, {
            onSuccess(data) {
                const temp = listUser
                temp[index].detailRepos = data
                setValue(temp);
            }
        })

    }, [index, item.login, listUser, mutationRepos, mutationUser, setValue])

    /** Render Functions */
    const handleRenderContent = useCallback(() => {
        const { detailUser, detailRepos } = item
        if (pendingRepos || pendingUser) {
            return (
                <div className='flex flex-col items-center'>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='70%' />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={70} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='60%' />
                    <Skeleton variant="rounded" width='100%' height={90} />
                </div>
            )
        } else {
            return (
                <div className='flex flex-col items-center'>
                    <Typography fontWeight={'bold'}>
                        <a href={detailUser?.html_url || ''} target='_blank'>
                            {detailUser?.login || ''}
                        </a>
                    </Typography>
                    <Typography variant='caption'>{detailUser?.location || ''}</Typography>
                    <div className='flex items-center mb-6'>
                        <PeopleAlt sx={{ height: 16 }} />
                        <Typography variant='caption'>{`${detailUser?.followers || 0} Followers`}</Typography>
                        <FiberManualRecord sx={{ height: 6 }} />
                        <Typography variant='caption'>{`${detailUser?.following || 0} Following`}</Typography>
                    </div>
                    {
                        detailRepos.map(el => (

                            <div key={el.id} className="flex flex-col mb-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-lg transition-all cursor-pointer shadow-sm border border-slate-200 w-full">
                                <a href={el.html_url} target='_blank'>
                                    <div className="p-4">
                                        <Typography fontWeight={'bold'}>{el.name}</Typography>
                                        <Typography variant='caption'>{el.description}</Typography>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={6}>
                                                <div className='flex items-center gap-1'>
                                                    <Restaurant color='success' sx={{ height: 18, width: 18 }} />
                                                    <Typography fontWeight={'bold'}>{el.forks_count}</Typography>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <Visibility sx={{ height: 18, width: 18 }} />
                                                    <Typography fontWeight={'bold'}>{el.watchers_count}</Typography>
                                                </div>
                                            </Grid2>
                                            <Grid2 size={6}>
                                                <div className='flex items-center gap-1'>
                                                    <Star color='warning' sx={{ height: 18, width: 18 }} />
                                                    <Typography fontWeight={'bold'}>{el.stargazers_count}</Typography>
                                                </div>
                                                {
                                                    Boolean(el.language) && (
                                                        <div className='flex items-center gap-1'>
                                                            <Code color='error' sx={{ height: 18, width: 18 }} />
                                                            <Typography fontWeight={'bold'}>{el.language}</Typography>
                                                        </div>
                                                    )
                                                }
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                </a>
                            </div>
                        ))
                    }
                </div>
            )
        }
    }, [item, pendingRepos, pendingUser])

    return (
        <Accordion
            expanded={isExpanded}
            key={item.id}
            onChange={(e, newValue) => {
                onHandleDetail()
                setIsExpanded(newValue);
            }}
        >
            <AccordionSummary expandIcon={<ArrowDropDown />}>
                <div className='flex items-center gap-3'>
                    <Avatar alt={item.login} src={item.avatar_url} />
                    <Typography>{item.login}</Typography>
                    <div className='flex gap-2'>

                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                {handleRenderContent()}

            </AccordionDetails>
        </Accordion>
    );
}
