import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import './board.css'

export default function Board({disabled, dimension, handleClick, cards, flipped, solved, width, height}) {
	return (
		<>
			<div className={'board'} style={{width, height}}>
				{cards.map(card => (
					<Card key={card.id} width={dimension / 4.5} height={dimension / 4.5} flipped={flipped.includes(card.id)} handleClick={handleClick} disabled={disabled || solved.includes(card.id)}  solved={solved.includes(card.id)} {...card} />
				))}
			</div>
		</>
	)
}

Board.prototype = {
	disabled: PropTypes.bool.isRequired,
	dimension: PropTypes.number.isRequired,
	cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	flipped: PropTypes.arrayOf(PropTypes.number).isRequired,
	solved: PropTypes.arrayOf(PropTypes.number).isRequired,
	handleClick: PropTypes.func.isRequired,
	width: PropTypes.string.isRequired,
	height: PropTypes.string.isRequired
}