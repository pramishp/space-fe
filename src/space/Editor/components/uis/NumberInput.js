
/**
 * It's a function that takes in a value and a handleChange(value) function, and returns an input element that has a value of the
 * value passed in, and an onChange function that calls the handleChange function passed in with the value of the input
 * element
 * @returns A function that returns a JSX element.
 */
export default function NumberInput({value, handleChange}){

    return(
        <input type={"number"} value={value} onChange={(e)=>handleChange(e.target.value)}/>
    )
}