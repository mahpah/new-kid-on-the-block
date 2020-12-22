import axios from 'axios'

export const getPeers = () => {
  return axios.get('http://localhost:9000', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.data.peers)
}

export const addPeer = (url: string) => {
  return axios.post('http://localhost:9000', {}, {
    params: {
      url
    }
  })
}

export const removePeer = (url: string) => {
  return axios.delete('http://localhost:9000', {
    params: {
      url
    }
  })
}
