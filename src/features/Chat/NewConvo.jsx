import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Avatar, Chip, CircularProgress, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, Button } from '@mui/material';
import useDebounce from '../../hooks/useDebounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function NewConvo({ conversation }) {
  const axiosPrivate = useAxiosPrivate()
  const {auth} = useAuth()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState(``)
  const [selectedUsers, setSelectedUsers] = useState([])
  const debouncedValue = useDebounce(searchValue, 1000)
  const queryClient = useQueryClient()

  const searchUser = async ()=>{
    const { data } =  await axiosPrivate.get(`/user/search?query=${searchValue}`) 
    const filterData = await data.filter(u=> u._id !== auth.userId)
    return filterData
  }
  const createConvo = async ( userIDs )=>{
    const { data } =  await axiosPrivate.post(`/message/conversation/`, { userIDs }) 
    return data
  }

  const { data: searchResult, isLoading } = useQuery({
    queryKey: [`newconvo`, debouncedValue],
    queryFn: debouncedValue && searchUser,
    enabled: !!debouncedValue
  })
  const handleChange = (e, value) => {
    setSelectedUsers(value)
  }
  const { mutate, isPending } = useMutation({
    mutationKey: [`newConvo`],
    mutationFn: createConvo, 
    onSuccess: (data)=>{
      queryClient.invalidateQueries({ queryKey: ['convo'] })
      navigate(`/message/chat/${data._id}`)
    }
  })
  const handleCreateConvo = () =>{
    const userIDs = selectedUsers.map(u=> u._id)
    const isConvoExists = conversation?.find(convo=> { 
    const memberIDs = convo.members.map(m=> m._id)?.filter(u=> u !== auth.userId)
      return JSON.stringify(memberIDs) === JSON.stringify(userIDs)
   })
  
    if(isConvoExists){
      navigate(`/message/chat/${isConvoExists.conversationId}`)
    }else{
      mutate([...userIDs, auth.userId])
    }
  }
  return (
    <Stack posiiton={`relative`} p={2} width={`100%`} height={300} gap={1}>
      <Typography variant="body1">Create new conversation</Typography>
       <Autocomplete
            multiple
            freeSolo
            loading={isLoading}
            id="checkboxes-tags-demo"
            options={searchResult || []}
            onInputChange={(e)=> setSearchValue(e.target.value)}
            onChange={handleChange}
            disableCloseOnSelect
            style={{ width: 500 }}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            renderTags={(tagValue, getTagProps) =>
              tagValue.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i).map((option, index) => (
                <Chip avatar={<Avatar src={option.profilePhoto}/>}
                      label={`${option.firstName} ${option.lastName}`}
                      {...getTagProps({ index })}
                />
              ))
            }
            renderOption={(props, option, { selected }) => {
            const isSelected = selectedUsers?.some(u => u._id === option._id)
            const { className, ...others } = props
            return <ListItem
                    {...others}
                    disablePadding
                    secondaryAction={
                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={isSelected}/>
                    }>
                      <ListItemButton >
                        <ListItemAvatar>
                            <Avatar src={option.profilePhoto} sx={{ width: 30, height: 30 }}/>
                        </ListItemAvatar>
                        <ListItemText primary={option.firstName +` `+ option.lastName} />
                      </ListItemButton>
                </ListItem>
            }}
            
            renderInput={(params) => (
                <TextField sx={{ width: { xs: 320, md: `100%` }}} {...params} label="Select user" placeholder="search user..." size='small'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                />
            )}
         />    
      <Button sx={{ display: `inline-block`, bottom: 0 }} onClick={handleCreateConvo} variant="contained" size='small' disabled={!selectedUsers.length || isPending}  color="primary">
        Chat
      </Button>
    </Stack>
  );
}