export default function optionalChaining() {
  const obj = {
    name: 'F8',
    cat: {
      name: 'Tom',
      cat2: {
        name: 'Tom 2',
        cat3: {
          name: 'Tom 3',
        }
      }
    }
  }

  if (obj.cat && obj.cat.cat2 && obj.cat.cat2.cat3) {
    console.log(obj.cat.cat2.cat3.name)
  }
}
