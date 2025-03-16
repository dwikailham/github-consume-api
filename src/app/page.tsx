'use client'
import { useState, useCallback, useRef } from 'react';
import { useGetSearchUser } from '@/hooks'
import { TextField, Button, Card, Stack, CardContent, Typography, CircularProgress, Skeleton, InputAdornment, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material'
import { TUser, TDetailUser, TDetailRepos } from '@/types'
import { Accordion, EmptyStateIllustration } from '@/components'

export default function Home() {

  /** States */
  const [search, setSearch] = useState<string>('')
  const [totalData, setTotalData] = useState<number>(0)
  const [listUser, setListUser] = useState<Array<TUser & { detailUser: TDetailUser | null, detailRepos: Array<TDetailRepos> }>>([])
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  /** Mutations */
  const { mutateAsync, isSuccess, isPending } = useGetSearchUser()

  /** Functions */
  const handleSearch = useCallback(() => {
    if (!search) {
      setListUser([])
      return
    }
    mutateAsync(search, {
      onSuccess(data) {
        setTotalData(data.total_count)
        const format = data.items.map((el) => ({
          ...el,
          detailUser: null,
          detailRepos: []
        }))
        setListUser(format)
      },
    })
  }, [mutateAsync, search])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && buttonRef.current) {
      buttonRef.current.click();
    }
  }

  const renderContent = useCallback(() => {
    if (listUser.length && isSuccess) {
      return (
        <>
          <Typography>{`Showing ${totalData} users GitHub`}</Typography>
          <Card>
            <CardContent>
              {listUser.map((el, index) => (
                <Accordion item={el} key={el.id} index={index} setValue={setListUser} listUser={listUser} />
              ))
              }
            </CardContent>
          </Card>
        </>
      )
    } else if (isSuccess && totalData === 0) {
      return (
        <EmptyStateIllustration description='Please try a different search keys' title='No Result' urlImage='/no-data-search.svg' />
      )
    } else if (isPending) {
      return (
        <>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='60%' />
          <Skeleton variant="rounded" width='100%' height={90} />
        </>
      )
    }
    else {
      return (
        <EmptyStateIllustration description='Please type Search Field for access repository' title='No Data Available Here' urlImage='/no-data.svg' />
      )
    }

  }, [isPending, isSuccess, listUser, totalData])

  return (
    <div className='px-5 mt-2'>
      <Stack spacing={2}>
        <TextField
          fullWidth
          id="search user"
          disabled={isPending}
          value={search}
          onChange={(e) => setSearch(e.target.value)} label="Search GitHub User"
          placeholder='Type GitHub username'
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch('')}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          onKeyDown={handleKeyPress}
        />
        <Button ref={buttonRef} onClick={handleSearch} disabled={isPending} fullWidth variant='contained'>{isPending && <CircularProgress size="20px" style={{ marginRight: 10 }} />}Search</Button>
        {renderContent()}
      </Stack>
    </div>
  );
}
