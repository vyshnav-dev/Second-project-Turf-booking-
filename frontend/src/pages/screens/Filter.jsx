import  { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Filter() {
  const { searchInfo } = useSelector((state) => state.search);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (searchInfo && typeof searchInfo === 'object') {
      // Convert the object into an array of items
      const itemArray = Object.values(searchInfo);
      setItems(itemArray);
    } else {
      setItems([]);
    }
  }, [searchInfo,setItems]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px', flexWrap: 'wrap' }}>
      {items.length > 0 ? (
        items.map((item) => (
          <Card key={item._id} style={{ width: '20rem', marginBottom: '20px', height: '22rem', backgroundColor: 'white' }}>
            <Link to={`/details/${item._id}`}>
              <Card.Img style={{ height: '22rem', width: '20rem' }} variant="top" src={`http://localhost:5000/Images/${item.imagePath && item.imagePath[0]}`} />
              <Card.Body>
                <Card.Title style={{ position: 'absolute', marginTop: '-5rem', color: 'white' }} className='tf1'>{item.turfname}</Card.Title>
                <ListGroup.Item style={{ marginTop: '-3rem', color: 'white', textDecoration: 'none' }} className='tf2'>{item.location}</ListGroup.Item>
              </Card.Body>
              <Card.Body>
                {/* You can add more details or buttons here if needed */}
              </Card.Body>
            </Link>
          </Card>
        ))
      ) : (
        <p>No items to display.</p>
      )}
    </div>
  );
}

export default Filter;

