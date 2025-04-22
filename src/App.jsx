//import logo from './logo.svg';
import './App.css'

function App() {
  //const [count, setCount] = useState(0)

  let like = '즐겨찾기'; //사용자가 선택한 책장으로 자동 변경되게 하기
  let bookname = [
    '책이름1', '책이름2', '책이름3', '책이름4', '책이름5',
    '책이름6', '책이름7', '책이름8', '책이름9', '책이름10',
    '책이름11', '책이름12', '책이름13', '책이름14'
  ];
   // 5개씩 끊어서 그룹화
   const chunkedBooks = [];
   for (let i = 0; i < bookname.length; i += 5) {
     chunkedBooks.push(bookname.slice(i, i + 5));
   }

  return (
    <div className='App'>
      <div className="nav">
        <h1 >디비디비딥</h1>        
      </div>
      <div className='top'>
        <div className='sentence'>
          <h2>나만의 작은 도서관</h2>
        </div>
        <div className='buttons'>
          <button className='button'>
            <h1>등록</h1>
          </button>
          <button className='button'>
            <h1>책장</h1>
          </button>
          <button className='button'>
            <h1>전체</h1>
          </button>
        </div>
        <div className='such'>
          <input type="text" placeholder='검색어를 입력하세요' className='search'/>
          <button className='search-button'>검색</button>
        </div>
      </div>
      <hr className='line'/>
      <div className='bookcase'>
        <h1 className='case-name'>📚{like}</h1>
        <div className='book-list'>
          {chunkedBooks.map((group, groupIndex) => (
            <div className='book-group' key={groupIndex}>
              {group.map((book, index) => (
                <div className='book-list-item' key={index}>
                  {book}
                  
                </div>
              ))}
              
            </div>
            
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
