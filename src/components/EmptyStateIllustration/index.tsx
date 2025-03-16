'use client'
import Image from 'next/image';
import { Typography } from '@mui/material';

type TProps = {
    urlImage: string
    title: string
    description: string
}

export default function Index(props: TProps) {

    /** Params */
    const { description, title, urlImage } = props

    return (
        <div className='flex flex-col items-center gap-2'>
            <Image alt='no-data' src={urlImage} width={320} height={320} />
            <Typography fontSize={18} fontWeight={'bold'}>{title}</Typography>
            <Typography>{description}</Typography>
        </div>
    );
}
