/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /users/me/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               middleName:
 *                 type: string
 *                 example: Georgiev
 *               phoneNumber:
 *                 type: string
 *                 example: +12025550123
 *     responses:
 *       200:
 *         description: Profile updated
 *       404:
 *         description: Profile not found
 */

/**
 * @openapi
 * /users/me/addresses:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all user addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /users/me/addresses:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - cityId
 *             properties:
 *               street:
 *                 type: string
 *                 example: 1 Vitosha blvd.
 *               cityId:
 *                 type: string
 *                 example: d6e0a4bd-3756-4b91-80d8-49fba774d669
 *     responses:
 *       201:
 *         description: Address created
 *       404:
 *         description: City not found
 */

/**
 * @openapi
 * /users/me/addresses/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: 5 Vitosha blvd.
 *               cityId:
 *                 type: string
 *                 example: d6e0a4bd-3756-4b91-80d8-49fba774d669
 *     responses:
 *       200:
 *         description: Address updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Address not found
 */

/**
 * @openapi
 * /users/me/addresses/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Address deleted
 *       400:
 *         description: Cannot delete default address
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Address not found
 */

/**
 * @openapi
 * /users/me/addresses/{id}/default:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Set default address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default address set
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Address not found
 */