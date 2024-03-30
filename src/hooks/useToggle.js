import useLocalStorage from "./useLocalStorage"

const useToggle = (key, initvalue) =>{
    const [value, setValue] = useLocalStorage(key, initvalue)

    const toggle = (value)=>{
        setValue(prev=>{
            return typeof value === 'boolean' ? value : !prev
        })
    }
    return [value, toggle]

}
export default useToggle